<template>
  <div class="categoria-form">
    <div class="d-flex align-center na-mb-3">
      <v-btn icon class="mr-3" @click="voltar">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1>{{ isEdicao ? 'Editar Categoria' : 'Nova Categoria' }}</h1>
    </div>
    
    <base-card>
      <v-form ref="form" @submit.prevent="salvar" v-model="formValido">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="categoria.nome"
              label="Nome da Categoria"
              :rules="[v => !!v || 'Nome é obrigatório']"
              required
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="categoria.categoriaPaiId"
              :items="categoriasPai"
              item-title="nome"
              item-value="id"
              label="Categoria Pai"
              clearable
              :disabled="isEdicao && temSubcategorias"
              :hint="isEdicao && temSubcategorias ? 'Não é possível alterar a categoria pai pois esta categoria possui subcategorias' : ''"
              persistent-hint
            ></v-select>
          </v-col>
          
          <v-col cols="12">
            <v-textarea
              v-model="categoria.descricao"
              label="Descrição"
              rows="3"
            ></v-textarea>
          </v-col>
        </v-row>
        
        <div class="d-flex justify-end">
          <v-btn
            variant="text"
            class="mr-2"
            @click="voltar"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            :loading="salvando"
            :disabled="!formValido"
          >
            {{ isEdicao ? 'Atualizar' : 'Cadastrar' }}
          </v-btn>
        </div>
      </v-form>
    </base-card>
    
    <!-- Snackbar para notificações -->
    <base-snackbar
      v-model="snackbar.show"
      :text="snackbar.text"
      :color="snackbar.color"
    ></base-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseCard from '@/components/BaseCard.vue'
import BaseSnackbar from '@/components/BaseSnackbar.vue'
import categoriaService, { Categoria } from '../services/categoriaService'

export default defineComponent({
  name: 'CategoriaForm',
  components: {
    BaseCard,
    BaseSnackbar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const form = ref(null)
    const formValido = ref(false)
    const salvando = ref(false)
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success'
    })
    
    // Dados da categoria
    const categoria = ref<Categoria>({
      nome: '',
      descricao: '',
      categoriaPaiId: null
    })
    
    // Lista de categorias para selecionar como pai
    const categorias = ref<Categoria[]>([])
    const temSubcategorias = ref(false)
    
    // Verifica se é edição ou criação
    const isEdicao = computed(() => !!route.params.id)
    
    // Filtra as categorias que podem ser selecionadas como pai
    const categoriasPai = computed(() => {
      if (!isEdicao.value) {
        return categorias.value
      }
      
      // Em edição, não pode selecionar a própria categoria ou suas subcategorias como pai
      const id = parseInt(route.params.id as string)
      
      // Função recursiva para encontrar todas as subcategorias
      const getSubcategoriaIds = (categoriaId: number): number[] => {
        const subcategorias = categorias.value.filter(c => c.categoriaPaiId === categoriaId)
        if (subcategorias.length === 0) return []
        
        const ids = subcategorias.map(c => c.id!)
        const subIds = subcategorias.flatMap(c => getSubcategoriaIds(c.id!))
        return [...ids, ...subIds]
      }
      
      const subcategoriaIds = getSubcategoriaIds(id)
      return categorias.value.filter(c => c.id !== id && !subcategoriaIds.includes(c.id!))
    })
    
    // Carrega a lista de categorias
    const carregarCategorias = async () => {
      try {
        categorias.value = await categoriaService.listar()
      } catch (error) {
        mostrarNotificacao('Erro ao carregar categorias', 'error')
        console.error(error)
      }
    }
    
    // Carrega os dados da categoria para edição
    const carregarCategoria = async () => {
      if (!isEdicao.value) return
      
      try {
        const id = parseInt(route.params.id as string)
        const data = await categoriaService.buscarPorId(id)
        categoria.value = data
        
        // Verifica se tem subcategorias
        temSubcategorias.value = (data.subcategorias?.length || 0) > 0
      } catch (error) {
        mostrarNotificacao('Erro ao carregar dados da categoria', 'error')
        console.error(error)
        router.push('/estoque/categorias')
      }
    }
    
    // Salva a categoria (cria ou atualiza)
    const salvar = async () => {
      salvando.value = true
      
      try {
        if (isEdicao.value) {
          const id = parseInt(route.params.id as string)
          await categoriaService.atualizar(id, categoria.value)
          mostrarNotificacao('Categoria atualizada com sucesso')
        } else {
          await categoriaService.criar(categoria.value)
          mostrarNotificacao('Categoria cadastrada com sucesso')
        }
        
        // Volta para a listagem após salvar
        setTimeout(() => {
          router.push('/estoque/categorias')
        }, 1500)
      } catch (error) {
        mostrarNotificacao('Erro ao salvar categoria', 'error')
        console.error(error)
      } finally {
        salvando.value = false
      }
    }
    
    // Volta para a listagem de categorias
    const voltar = () => {
      router.push('/estoque/categorias')
    }
    
    // Exibe uma notificação
    const mostrarNotificacao = (texto: string, cor: string = 'success') => {
      snackbar.value = {
        show: true,
        text: texto,
        color: cor
      }
    }
    
    // Carrega os dados ao montar o componente
    onMounted(() => {
      carregarCategorias()
      carregarCategoria()
    })
    
    return {
      categoria,
      categorias,
      categoriasPai,
      temSubcategorias,
      form,
      formValido,
      salvando,
      isEdicao,
      snackbar,
      salvar,
      voltar
    }
  }
})
</script>